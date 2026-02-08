// Size Converter Script - Extracted for performance optimization
document.addEventListener("DOMContentLoaded", function () {
  var sizeSwitch = document.getElementById("size-switch");
  var variantSelect = document.querySelector("variant-selects"); // 📌 Capturamos el componente de Shopify
  var variantDropdown = document.querySelector("select[name='id']"); // 📌 Capturamos el `<select>` oculto de Shopify

  if (!sizeSwitch || (!variantSelect && !variantDropdown)) {
    console.error("❌ No se encontró el selector de talles o el control de variantes.");
    return;
  }

  // Cargar la conversión de talles desde Shopify
  var sizeConversionData = document.getElementById("size-conversion-data");
  var sizeMap = sizeConversionData ? JSON.parse(sizeConversionData.textContent) : {};

  console.log("🟢 Conversión de talles cargada:", sizeMap);

  function updateSizeSystem() {
    var selectedSystem = sizeSwitch.value;

    document.querySelectorAll(".bls__option-swatch").forEach(function (swatch) {
      var originalSize = swatch.getAttribute("data-value");

      // Buscar la conversión correcta en el JSON
      var newSize = sizeMap[originalSize] ? sizeMap[originalSize][selectedSystem] : originalSize;

      var labelItem = swatch.querySelector(".bls_swatche-item");
      if (labelItem) labelItem.textContent = newSize;

      // 📌 ACTUALIZAR LA VARIANTE SELECCIONADA EN SHOPIFY
      swatch.addEventListener("click", function () {
        document.querySelectorAll(".bls__option-swatch").forEach(s => s.classList.remove("active"));
        swatch.classList.add("active");

        // 📌 Buscar la variante correcta en `<variant-selects>` o `<select>`
        let matchingVariant;
        if (variantSelect) {
          matchingVariant = Array.from(variantSelect.querySelectorAll("option")).find(option => 
            option.textContent.includes(originalSize)
          );
          variantSelect.value = matchingVariant ? matchingVariant.value : variantSelect.value;
          variantSelect.dispatchEvent(new Event("change", { bubbles: true })); // 📌 Dispara el evento de cambio en Shopify
        } else if (variantDropdown) {
          matchingVariant = Array.from(variantDropdown.options).find(option => 
            option.textContent.includes(originalSize)
          );
          variantDropdown.value = matchingVariant ? matchingVariant.value : variantDropdown.value;
          variantDropdown.dispatchEvent(new Event("change")); // 📌 Dispara el evento de cambio
        }

        if (matchingVariant) {
          console.log("✅ Variante seleccionada correctamente:", matchingVariant.value);
        } else {
          console.error("⚠ No se encontró la variante correspondiente en Shopify.");
        }
      });
    });

    console.log(`✅ Cambio de talles a: ${selectedSystem}`);
  }

  sizeSwitch.addEventListener("change", updateSizeSystem);
  updateSizeSystem(); // Ejecutar al cargar la página
});
