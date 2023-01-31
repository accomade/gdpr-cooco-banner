<script lang="ts"> 
  import { Banner } from '$lib/index'
  import type { Translation } from '$lib/index'

  let translation:Translation = {
    heading: 'GDPR Cookie Consent',
    description: 'We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.',
    acceptLabel: 'Accept All Cookies',
    rejectLabel: 'Only Necessary Cookies',
    settingsLabel: 'Cookie Settings',
    closeLabel: 'Close And Accept',
    editLabel: 'Edit Cookie Settings',
    
    cookieDescriptions: {
      necessary: 'Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.',
      preferences: 'Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.',
      analytics: 'Analytics cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.',
      marketing: 'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.'
    },
    cookieLabels: {
      necessary: 'Necessary cookies',
      preferences: 'Tracking cookies',
      analytics: 'Analytics cookies',
      marketing: 'Marketing cookies'
    }
  }

  const analytics = ( e:CustomEvent ) => {
    console.log("Analytics", e.detail.enabled)
  }

</script>

<Banner 
    {translation} 
    choices={["necessary", "analytics"]} 
    on:analytics={ analytics }
  />

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
