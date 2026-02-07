(() => {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnnbedye";

  updateTimezoneClocks();
  initContactForm();

  function updateTimezoneClocks() {
    const nodes = Array.from(document.querySelectorAll("[data-timezone]"));
    if (!nodes.length) {
      return;
    }

    const update = () => {
      const now = new Date();

      nodes.forEach((node) => {
        const timezone = node.dataset.timezone;
        if (!timezone) {
          return;
        }

        const label = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: timezone
        }).format(now);

        node.textContent = label;
      });
    };

    update();
    window.setInterval(update, 30000);
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    const message = document.getElementById("formMessage");
    const submitButton = form?.querySelector("button[type='submit']");

    if (!form || !message || !submitButton) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        message.textContent = "Please complete all required fields before sending.";
        message.classList.remove("is-error");
        return;
      }

      const originalLabel = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
      message.textContent = "";

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        message.textContent = "Message sent successfully. I will get back to you soon.";
        message.classList.remove("is-error");
        form.reset();
      } catch (error) {
        message.textContent = "Unable to send right now. Please try again or email me directly.";
        message.classList.add("is-error");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    });
  }
})();
