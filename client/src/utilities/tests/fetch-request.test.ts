import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { fetchRequest } from "../fetch-request";

describe("fetchRequest", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  })
  
  it("returns parsed JSON for a successful JSON response", async () => {
    const response = {
      ok: true,
      status: 200,
      headers: {
        get: () => "application/json"
      },
      json: async () => ({ message: "ok"})
    } as unknown as Response;

    vi.mocked(fetch).mockResolvedValue(response);

    await expect(fetchRequest("/url", { method: "GET" })).resolves.toEqual({ message: "ok" })
    expect (fetch).toHaveBeenCalledWith("/url", {
      method: "GET",
      credentials: "include"
    })
  })

  it("returns undefined for a successful non-JSON response", async () => {
    const response = {
      ok: true,
      status: 200,
      headers: {
        get: () => "different output"
      }
    } as unknown as Response;

    vi.mocked(fetch).mockResolvedValue(response);

    await expect(fetchRequest("/url", { method: "GET" })).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith("/url", {
      method: "GET",
      credentials: "include"
    })
  })

  it("returns undefined for a response status of 204", async () => {
    const response = {
      ok: true,
      status: 204,
      headers: {
        get: () => "application/json"
      },
      json: async () => ({ message: "ok" })
    } as unknown as Response;

    vi.mocked(fetch).mockResolvedValue(response);

    await expect(fetchRequest("/url", { method: "GET" })).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith("/url", {
      method: "GET",
      credentials: "include"
    })
  })

  it("throws a fallback error for a response not carrying a specific error message", async () => {
    const response = {
      ok: false,
      status: 400,
      json: async () => ({ message: "Generic error" })
    } as unknown as Response;

    vi.mocked(fetch).mockResolvedValue(response);

    await expect(fetchRequest("/url", { method: "GET" })).rejects.toMatchObject({
      message: "Response status: 400",
      status: 400,
      data: { message: "Generic error" }
    })
  })

  it("throws a specific error for a response carrying a specific error message", async () => {
    const response = {
      ok: false,
      status: 400,
      json: async () => ({ error: "Invalid request. Please try again with correct input"})
    } as unknown as Response

    vi.mocked(fetch).mockResolvedValue(response);

    await expect(fetchRequest("/url", { method: "GET" })).rejects.toMatchObject({
      message: "Invalid request. Please try again with correct input",
      status: 400,
      data: { error: "Invalid request. Please try again with correct input" }
    })
  })

  it("throws a fallback error when parsing the error response fails", async () => {
    const response = {
      ok: false,
      status: 400,
      json: async () => {throw new Error("Error: Invalid request")}
    } as unknown as Response

    vi.mocked(fetch).mockResolvedValue(response);

    await expect(fetchRequest("/url", { method: "GET" })).rejects.toMatchObject({
      message: "Response status: 400",
      status: 400,
      data: undefined
    })
  })
})