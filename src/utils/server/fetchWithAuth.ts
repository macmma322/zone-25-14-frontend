// This file is part of the Zone 25-14 project, which is released under the GNU General Public License v3.0.
// File: src/utils/server/fetchWithAuth.ts
import api from "../api";

export const fetchWithAuth = async (
  url: string,
  method = "GET",
  body?: unknown
) => {
  try {
    const response = await api.request({
      url,
      method,
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error("Auth fetch error:", error);
    throw error;
  }
};
