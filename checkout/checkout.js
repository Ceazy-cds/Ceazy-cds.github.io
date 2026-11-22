(() => {
  // Valori pubblici del catalogo Paddle Sandbox.
  const token = "test_4ba88b65723c84ca5dc36b26a0f";
  const priceId = "pri_01m826sydh1jaagjtpem5nzyh0";

  const button = document.getElementById("pay");
  const status = document.getElementById("status");
  if (!/^test_[a-zA-Z0-9]+$/.test(token) || !/^pri_[a-z0-9]{26}$/.test(priceId)) {
    status.textContent = "Il checkout di prova è in configurazione.";
    return;
  }

  const paddle = window.Paddle;
  if (!paddle) {
    status.textContent = "Paddle non è raggiungibile. Ricarica la pagina per riprovare.";
    return;
  }

  const paymentLink = new URLSearchParams(window.location.search).has("_ptxn");
  const claim = new URLSearchParams(window.location.hash.slice(1)).get("claim");
  let completed = false;
  const checkoutError = () => {
    button.disabled = paymentLink;
    status.textContent = "Impossibile aprire il checkout di prova. Riprova.";
  };

  try {
    paddle.Environment.set("sandbox");
    paddle.Initialize({
      token,
      checkout: { settings: { displayMode: "overlay", locale: "it", allowLogout: false } },
      eventCallback(event) {
        switch (event.name) {
          case "checkout.loaded":
            status.textContent = "";
            break;
          case "checkout.completed":
            completed = true;
            button.disabled = true;
            status.textContent = "Pagamento di prova completato in Paddle.";
            break;
          case "checkout.closed":
            if (completed) break;
            button.disabled = paymentLink;
            status.textContent = paymentLink ? "Checkout chiuso. Ricarica per riaprirlo." : "Checkout chiuso. Puoi riprovare.";
            break;
          case "checkout.error":
            checkoutError();
            break;
        }
      }
    });
    button.disabled = paymentLink;
    status.textContent = paymentLink ? "Apertura del checkout da Paddle…" : "";
  } catch {
    status.textContent = "Configurazione Paddle non disponibile. Ricarica per riprovare.";
    return;
  }

  button.addEventListener("click", () => {
    button.disabled = true;
    status.textContent = "Apertura del checkout…";
    try {
      const options = { items: [{ priceId, quantity: 1 }] };
      if (/^[a-f0-9]{64}$/.test(claim ?? "")) {
        options.customData = { cs_sandbox_claim: claim };
      }
      paddle.Checkout.open(options);
    } catch {
      checkoutError();
    }
  });
})();
