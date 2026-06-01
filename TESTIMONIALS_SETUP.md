# Testimonials Setup Guide

## Step 1: Set Up Cloudinary (Free Account)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free tier)
2. In your Dashboard, find your **Cloud Name** (looks like `abc123xyz`)
3. Go to Settings → Upload
4. Create an **Upload Preset**:
   - Click "Add upload preset"
   - Name it: `dda_testimonials`
   - Set Mode to "Unsigned"
   - Save it

## Step 2: Add Your Credentials to index.html

In the JavaScript section (near the end), find:
```javascript
cloudinary.openUploadWidget(
  {
    cloudName: "YOUR_CLOUD_NAME",
    uploadPreset: "YOUR_UPLOAD_PRESET",
```

Replace:
- `YOUR_CLOUD_NAME` with your actual cloud name (from Dashboard)
- `YOUR_UPLOAD_PRESET` with `dda_testimonials`

## Step 3: User Flow

**When someone submits a testimonial:**

1. They fill out the form (Name, Age, Email, Event, Looking for, Testimonial, Rating)
2. Form goes to your email via Formspree
3. You review the testimonial
4. User emails you their photo (or you request it separately)
5. You upload the photo to Cloudinary using the widget
6. Cloudinary gives you an image URL
7. You add the testimonial + image URL to the `testimonials` array in index.html

## Step 4: Add a Published Testimonial

In the `<script>` section, find the `testimonials` array:

```javascript
const testimonials = [
  {
    name: "Sarah",
    age: 28,
    event: "Blind Duck Dating",
    rating: 5,
    quote: "I came looking for a date and left with two new friends!",
    image: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/your-image.jpg"
  },
  // Add more testimonials here...
];
```

Copy this template and add a new object:

```javascript
{
  name: "John",
  age: 31,
  event: "Poly Speed Dating 2025",
  rating: 5,
  quote: "Amazing experience! Real conversations, not just swiping.",
  image: "PASTE_CLOUDINARY_URL_HERE"
}
```

## Step 5: Get Cloudinary Image URL

When you upload an image to Cloudinary:
1. Upload via their dashboard or widget
2. Copy the "Secure URL" (looks like: `https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/filename.jpg`)
3. Paste it in the `image` field in your testimonials array

## Testimonial Card Shows:
- Profile image (circular)
- Name & Age
- Event attended
- Star rating (★★★★★)
- Testimonial quote

---

**Questions?** The testimonials will automatically render on the home page once you add them to the array!
