<script lang="ts"> 
  import { Banner } from '$lib/index'
  import type { Translation } from '$lib/index'

  let translation:Translation = {
    heading: 'GDPR Cookie Consent',
    description: 'We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.',
    acceptLabel: 'Accept cookies',
    rejectLabel: 'Reject cookies',
    settingsLabel: 'Cookie settings',
    closeLabel: 'Close settings',
    editLabel: 'Edit cookie settings',
    
    cookieDescriptions: {
      necessary: 'Used for cookie control. Can\'t be turned off.',
      tracking: 'Used for advertising purposes.',
      analytics: 'Used to control Google Analytics, a 3rd party tool offered by Google to track user behavior.',
      marketing: 'Used for marketing data.'
    },
    cookieLabels: {
      necessary: 'Necessary cookies',
      tracking: 'Traccikng cookies',
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
