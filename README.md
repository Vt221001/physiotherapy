# The Wellness Physio Clinic

An English-language React website for the clinic in Meerganj, Jaunpur. React Router provides individual URLs for the home, about, services, six service details, FAQs and appointment enquiry pages.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

Vite places the production output in `dist/`. The default local build displays a call or email fallback because it has no form delivery service.

## Deploy on Netlify

1. Import the repository in Netlify. The build command, Node version, publish directory, form build flag and SPA rewrite are in `netlify.toml`.
2. Enable form detection in **Forms**, then deploy the site. Confirm that a form named **appointment** appears. Netlify reads the static form definition in `public/appointment-form.html`. Keep its field names in sync with `src/Contact.jsx`.
3. In **Forms > Submission notifications**, add `Shivamg1204@gmail.com` as the recipient. The mailbox owner may need to confirm the address from Netlify's email.
4. Open and refresh a direct service URL on the deployed site. Send a clearly labelled test enquiry with non-sensitive details. Confirm it appears under **Forms** and that the intended clinic recipient receives the notification before sharing the site with patients.

The React form posts URL-encoded data to the static form path and waits for the default Netlify acknowledgement. If form delivery is unavailable or fails, it offers the clinic's phone and email. Appointment times are confirmed separately by the clinic.

See [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/) and [submission notifications](https://docs.netlify.com/manage/forms/notifications/).

## Deploy on Apache

Run `npm run build` with `VITE_NETLIFY_FORMS` unset and copy the **contents** of `dist/`, including `.htaccess`, to the document root. Enable `mod_rewrite` and allow `FileInfo` and `Indexes` overrides for that directory, or place the equivalent rules in the virtual host configuration. URLs assume deployment at a domain root. An Apache deployment uses the clinic's phone and email. Online submission on Apache requires an enquiry backend.

## Clinic details

The supplied brochure is the source for the clinic name, address, telephone, practitioner name and four advertised service areas. The email address came from the project brief. The map link searches by the supplied address. Confirm current clinic opening hours and the scope of neurological rehabilitation and older adult mobility support before advertising those services. Clinic details and service content are in `src/content.js`. The two generated photos in `public/images` illustrate physiotherapy appointments.

### Photography

The built-in image generator created a diptych exported as `public/images/movement-assessment.jpg` and `public/images/guided-mobility.jpg`.

> Create a photorealistic editorial photography master asset for an Indian physiotherapy clinic website. One horizontal image, composed as two photographs edge-to-edge in a simple diptych separated by a clean vertical boundary at exactly 50% width, with no separator gutter, no logos no type. Each half is a fully independent square photo for cropping. LEFT HALF, hero: naturally lit upscale but believable Indian physical therapy clinic, South Asian male physiotherapist with short dark hair and trimmed beard in dark forest green scrubs, carefully and naturally supporting the upper arm of a seated adult South Asian female patient in oatmeal athletic clothing as she raises her bent arm during an assessment. Genuine attentive expressions, natural hands and limb anatomy, medium-wide framing showing the two people from waist up near center, soft window light and warm off-white plaster walls, warm wood, a small olive green plant, quiet warm film treatment and elegant professional magazine quality. RIGHT HALF: independent candid environmental photo in similar light, South Asian female physiotherapist in dark teal scrubs standing beside an older South Asian male patient in warm ochre top, together discussing movement near an unbranded treatment table, daylight, wood and cream walls. Realistic safe clinical composition, local warmth, architectural lines, no white coat, no text, no graphics, no watermarks. Each of the two photographs must remain self-contained.
