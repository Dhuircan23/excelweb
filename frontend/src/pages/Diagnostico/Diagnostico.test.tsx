import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Diagnostico from "./Diagnostico";
import DiagnosticoGracias from "./DiagnosticoGracias";

function renderDiagnostico() {
  return render(
    <MemoryRouter initialEntries={["/diagnostico"]}>
      <Routes>
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/diagnostico/gracias" element={<DiagnosticoGracias />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillStep1(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Nombre/), "Ana Torres");
  await user.type(screen.getByLabelText(/Empresa/), "Ferretería Andes");
  await user.type(screen.getByLabelText(/Email/), "ana@andes.cl");
  await user.click(screen.getByRole("button", { name: "Continuar" }));
}

async function fillStep2(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Qué haces actualmente/), "Controlo el inventario en Excel.");
  await user.click(screen.getByRole("button", { name: "Continuar" }));
}

describe("Diagnostico form", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("blocks advancing past step 1 and shows errors when required fields are empty", async () => {
    const user = userEvent.setup();
    renderDiagnostico();

    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(await screen.findByText(/Necesitamos tu nombre/)).toBeInTheDocument();
    expect(screen.getByText(/Indica la empresa/)).toBeInTheDocument();
    expect(screen.getByText(/Revisa el correo/)).toBeInTheDocument();
    // Still on step 1 — step 2's field should not be in the document.
    expect(screen.queryByLabelText(/Qué haces actualmente/)).not.toBeInTheDocument();
  });

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup();
    renderDiagnostico();

    await user.type(screen.getByLabelText(/Nombre/), "Ana");
    await user.type(screen.getByLabelText(/Empresa/), "Andes");
    await user.type(screen.getByLabelText(/Email/), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(await screen.findByText(/Revisa el correo/)).toBeInTheDocument();
  });

  it("submits successfully and shows the confirmation page", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: "lead_123", createdAt: new Date().toISOString() }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderDiagnostico();

    await fillStep1(user);
    await fillStep2(user);

    await user.click(screen.getByRole("button", { name: "Solicitar diagnóstico" }));

    expect(await screen.findByText(/Listo\. Ya tenemos tu proceso\./)).toBeInTheDocument();
    expect(screen.getByText(/Ana/)).toBeInTheDocument();

    // The component also fires analytics beacons (diagnostico_started,
    // diagnostico_submitted) through the same global fetch — find the one
    // real submission call among them.
    const leadCall = fetchMock.mock.calls.find(([url]) => String(url).includes("/api/leads"));
    expect(leadCall).toBeTruthy();
    const [url, options] = leadCall as [string, RequestInit];
    expect(url).toContain("/api/leads");
    expect(options.method).toBe("POST");
    expect(options.body).toBeInstanceOf(FormData);
  });

  it("shows a clear error message and stays on the form when the API rejects the submission", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "VALIDATION_ERROR", message: "Revisa los campos obligatorios del formulario." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderDiagnostico();

    await fillStep1(user);
    await fillStep2(user);
    await user.click(screen.getByRole("button", { name: "Solicitar diagnóstico" }));

    expect(await screen.findByText("Revisa los campos obligatorios del formulario.")).toBeInTheDocument();
    // Submission failed, so we must still be on the form, not the confirmation page.
    expect(screen.queryByText(/Listo\. Ya tenemos tu proceso\./)).not.toBeInTheDocument();
  });

  it("disables the submit button while a submission is in flight", async () => {
    let resolveFetch!: (value: unknown) => void;
    const fetchMock = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderDiagnostico();

    await fillStep1(user);
    await fillStep2(user);
    await user.click(screen.getByRole("button", { name: "Solicitar diagnóstico" }));

    const submitBtn = await screen.findByRole("button", { name: "Enviando…" });
    expect(submitBtn).toBeDisabled();

    resolveFetch({ ok: true, status: 201, json: async () => ({ id: "lead_1", createdAt: new Date().toISOString() }) });
    await waitFor(() => expect(screen.queryByText(/Listo\. Ya tenemos tu proceso\./)).toBeInTheDocument());
  });
});
