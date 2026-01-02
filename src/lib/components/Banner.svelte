<script lang="ts">
  import Cookies from "js-cookie";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import type {
    CookieType,
    CookieChoice,
    Translation,
  } from "$lib/types/cookie";

  interface Props {
    cookieName?: string;
    showEditIcon?: boolean;
    translation: Translation;
    /**Set by client, defines which cookie options will be displayed*/
    choices: CookieType[];
    analytics?: (enabled: boolean) => void;
    marketing?: (enabled: boolean) => void;
    preferences?: (enabled: boolean) => void;
  }

  let {
    cookieName = "gdpr-cookie-consent",
    showEditIcon = true,
    translation,
    choices,
    analytics = () => {},
    marketing = () => {},
    preferences = () => {},
  }: Props = $props();

  /**The options the user has chosen, from the set of possible options*/
  type Chosen = { [key in CookieType]?: CookieChoice };
  let chosen: Chosen = $derived.by(() => {
    const result: Chosen = {};
    for (const ct of choices) {
      //necessary is alway true
      let choice: CookieChoice | undefined;
      if (ct == "necessary") {
        choice = { value: true };
      }

      //otherwise initialize with false;
      if (!choice) {
        choice = { value: false };
      }

      result[ct] = choice;
    }
    return result;
  });

  let show = $state(false);
  let showSettings = $state(false);

  export function showBanner() {
    show = true;
  }

  onMount(() => {
    /**Read cookie*/
    const cookie = Cookies.get(cookieName);
    if (!cookie) {
      showBanner();
    }

    if (cookie) {
      try {
        const chosenCookie: Chosen = JSON.parse(cookie) as Chosen;
        for (const cc in chosenCookie) {
          chosen[cc as CookieType] = chosenCookie[
            cc as CookieType
          ] as CookieChoice;
        }
      } catch (e) {
        //JSON parse error ... some tinkering?
        removeCookie();
        showBanner();
      }

      const valid = validate();
      if (!valid) {
        removeCookie();
        showBanner();
      }

      notify();
    }
  });

  const setCookie = () => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);

    const cookieString = JSON.stringify(chosen);
    Cookies.set(cookieName, cookieString, {
      sameSite: "strict",
      path: "/",
      expires,
    });
  };

  function removeCookie() {
    Cookies.remove(cookieName, { path: "/" });
  }

  function notify() {
    let t: keyof Chosen;
    for (t in chosen) {
      const choice = chosen[t];

      if (choice) {
        switch (t) {
          case "analytics":
            analytics?.(choice.value);
            break;
          case "preferences":
            preferences?.(choice.value);
            break;
          case "marketing":
            marketing?.(choice.value);
            break;
        }
      }
    }
    show = false;
  }

  const closeAndAcceptSelected = () => {
    showSettings = false;
    setCookie();
    notify();
  };

  const acceptAll = () => {
    for (const t of choices) {
      chosen[t] = {
        value: true,
      };
    }

    setCookie();
    notify();
  };

  const reject = () => {
    for (const t of choices) {
      if (t == "necessary") {
        chosen[t] = {
          value: true,
        };
      } else {
        chosen[t] = {
          value: false,
        };
      }
    }

    setCookie();
    notify();
  };

  const validate = (): boolean => {
    const missing = choices.filter((reqCookie) => !!chosen[reqCookie]);
    return missing.length == choices.length;
  };

  const value = (ct: CookieType): boolean => {
    let choice = chosen[ct];
    if (!choice) {
      return false;
    }

    return choice.value;
  };

  const toggled = (ct: CookieType) => {
    if (!chosen[ct]) {
      console.error("unknown cookie choice");
      return;
    }
    chosen[ct].value = !chosen[ct].value;
  };
</script>

{#if showEditIcon}
  <button
    class="cookieConsentToggle"
    aria-label={translation.editLabel}
    onclick={showBanner}
    transition:fade
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17
        0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13
        35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0
        0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77
        54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11
        80.53-12.76l69.13-35.21a132.273 132.273 0 0 0
        57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176
        368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32
        32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33
        32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32
        32-14.33 32-32 32z"
      />
    </svg>
  </button>
{/if}

{#if show}
  <div class="cookieConsentWrapper" transition:fade>
    <div class="cookieConsent">
      <div class="cookieConsent__Left">
        <div class="cookieConsent__Content">
          <p class="cookieConsent__Title">{translation.heading}</p>
          <p class="cookieConsent__Description">
            {@html translation.description}
          </p>
        </div>
      </div>
      <div class="cookieConsent__Right">
        <button
          type="button"
          class="cookieConsent__Button"
          aria-label={translation.settingsLabel}
          onclick={() => {
            showSettings = true;
          }}
        >
          {translation.settingsLabel}
        </button>
        {#if choices.length > 1}
          <button
            type="submit"
            class="cookieConsent__Button"
            onclick={reject}
            aria-label={translation.rejectLabel}
          >
            {translation.rejectLabel}
          </button>
          <button
            type="submit"
            class="cookieConsent__Button"
            onclick={acceptAll}
            aria-label={translation.acceptLabel}
          >
            {translation.acceptLabel}
          </button>
        {:else}
          <button
            type="submit"
            class="cookieConsent__Button"
            onclick={closeAndAcceptSelected}
            aria-label={translation.rejectLabel}
          >
            {translation.closeLabel}
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if showSettings}
  <div class="cookieConsentOperations" transition:fade>
    <div class="cookieConsentOperations__List">
      {#each choices as ct}
        <div
          class="cookieConsentOperations__Item"
          class:disabled={ct === "necessary"}
        >
          <input
            type="checkbox"
            id={`gdpr-check-${ct}`}
            checked={value(ct)}
            onclick={() => toggled(ct)}
            disabled={ct === "necessary"}
          />
          <label for={`gdpr-check-${ct}`}>{translation.cookieLabels[ct]}</label>
          <span class="cookieConsentOperations__ItemLabel">
            {translation.cookieDescriptions[ct]}
          </span>
        </div>
      {/each}
      <button
        type="submit"
        class="cookieConsent__Button cookieConsent__Button--Close"
        aria-label={translation.closeLabel}
        onclick={closeAndAcceptSelected}
      >
        {translation.closeLabel}
      </button>
    </div>
  </div>
{/if}

<style>
  .cookieConsentToggle {
    width: 40px;
    height: 40px;
    position: fixed;
    will-change: transform;
    padding: 9px;
    border: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    background: white;
    border-radius: 50%;
    bottom: 20px;
    right: 20px;
    transition: 200ms;
    opacity: 1;
    z-index: 99980;
  }

  .cookieConsentToggle:hover {
    color: white;
    background: black;
  }

  .cookieConsentToggle * {
    fill: currentColor;
  }

  .cookieConsentWrapper {
    z-index: 99990;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    color: white;
    padding: 20px;
    transition: 200ms;
  }

  .cookieConsent {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }

  .cookieConsent__Content {
    margin-right: 40px;
  }

  .cookieConsentWrapper * {
    color: white;
  }

  .cookieConsent__Title {
    margin: 0;
    font-weight: bold;
  }

  .cookieConsent__Description {
    margin: 10px 0 0;
  }

  .cookieConsent__Right {
    display: flex;
    align-items: flex-end;
  }

  .cookieConsentOperations {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    transition: 300ms;
    will-change: transform;
    z-index: 99999;
  }

  .cookieConsentOperations .cookieConsentOperations__List {
    transform: scale(1);
  }

  .cookieConsentOperations__List {
    background: white;
    color: black;
    max-width: 500px;
    padding: 40px;
    margin: auto;
    overflow-y: auto;
    box-sizing: border-box;
    max-height: 100vh;
    transition: 200ms transform;
    will-change: transform;
    transform: scale(0.95);
  }

  .cookieConsentOperations__Item {
    display: block;
    padding-left: 60px;
    margin-bottom: 20px;
  }

  .cookieConsentOperations__Item.disabled {
    color: #999;
  }

  .cookieConsentOperations__Item.disabled label::after {
    opacity: 0.3;
  }

  .cookieConsentOperations__Item input {
    display: none;
  }

  .cookieConsentOperations__Item label {
    align-items: center;
    font-size: 22px;
    font-weight: bold;
    display: block;
    position: relative;
  }

  .cookieConsentOperations__Item label::before {
    content: "";
    display: block;
    left: -60px;
    background: #dedede;
    height: 20px;
    border-radius: 20px;
    width: 40px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .cookieConsentOperations__Item label::after {
    content: "";
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: black;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -58px;
    transition: 200ms;
  }

  .cookieConsentOperations__Item input:checked + label::after {
    transform: translate(20px, -50%);
  }

  .cookieConsent__Button {
    padding: 15px 40px;
    display: block;
    background: white;
    color: black;
    white-space: nowrap;
    border: 0;
    font-size: 16px;
    margin-left: 10px;
    cursor: pointer;
    transition: 200ms;
  }

  .cookieConsent__Button--Close {
    background: black;
    color: white;
    margin: 40px 0 0 60px;
    padding: 15px 60px;
  }

  .cookieConsent__Button:hover {
    opacity: 0.6;
  }

  @media only screen and (max-width: 500px) {
    .cookieConsent {
      display: block;
    }

    .cookieConsent__Right {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      gap: 0.5rem;
      align-items: stretch;
    }

    .cookieConsent__Button {
      margin: 0 5px 5px 0;
      padding-top: 5px;
      padding-right: 10px;
      padding-bottom: 5px;
      padding-left: 10px;
    }

    .cookieConsentOperations__List {
      padding: 10px;
    }

    .cookieConsent__Button--Close {
      margin: 40px 0 0;
    }
  }

  @media only screen and (max-width: 1200px) and (min-width: 500px) {
    .cookieConsent {
      display: block;
    }

    .cookieConsent__Right {
      margin-top: 20px;
    }

    .cookieConsent__Button {
      margin: 0 10px 10px 0;
    }

    .cookieConsent__Button--Close {
      margin: 40px 0 0;
    }
  }
</style>
