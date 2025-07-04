export function configurarCalculoOtroConcepto(otroConceptoInput, totalInput) {
  otroConceptoInput.addEventListener("input", () => {
    const otro = parseInt(otroConceptoInput.value) || 0;
    const total = parseInt(totalInput.value) || 0;
    totalInput.value = total + otro;
  });
}
