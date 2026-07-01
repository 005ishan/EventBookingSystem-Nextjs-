import api from "./api";

export async function uploadEventImage(file) {
  const formData = new FormData();
  formData.append("eventImage", file);
  const res = await api.post("/events/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function createEvent(eventData) {
  const res = await api.post("/events", eventData);
  return res.data;
}

export async function getAllEvents(params = {}) {
  const res = await api.get("/events", { params });
  return res.data;
}
