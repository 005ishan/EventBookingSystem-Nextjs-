import api from "./api";

export async function initiateEsewaPayment(eventId, seats) {
  const res = await api.post("/esewa/initiate", { eventId, seats });
  return res.data;
}

export async function verifyEsewaPayment(bookingId, encodedData) {
  const res = await api.post("/esewa/verify", { bookingId, encodedData });
  return res.data;
}

/**
 * Auto-submit the eSewa payment form by creating and submitting a hidden form.
 */
export function submitToEsewa(gatewayUrl, formData) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = gatewayUrl;
  form.style.display = "none";

  Object.entries(formData).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
