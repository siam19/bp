


# Drops Archive Specifications (/d)


## 1. Page Context

The Drops Archive is the repository for the brand's history of collections. It serves as a visual timeline and allows users to browse past, current, and upcoming collections outside of the Home Page context.


## 2. Layout & Components


### A. Navbar



* **Component:** Uses the standard Navbar component.
* **Navigation:** Provides back navigation to the Home page (/).


### B. Content Layout



* **Structure:** Vertical scroll of immersive, wide aspect-ratio cards (16:9).
* **Card Interaction:** Tapping any card navigates to the specific Drop Page (/[drop-slug]).


### C. Drop Card Types


<table>
  <tr>
   <td><strong>Status</strong>
   </td>
   <td><strong>Badge Text</strong>
   </td>
   <td><strong>Visual Cues</strong>
   </td>
   <td><strong>Content</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Live</strong>
   </td>
   <td>"LIVE NOW" (Pulsing)
   </td>
   <td>High visibility, primary accent color border/shadow (e.g., Red).
   </td>
   <td>Drop Title, Countdown text ("Ends in {X} Days").
   </td>
  </tr>
  <tr>
   <td><strong>Upcoming</strong>
   </td>
   <td>"UPCOMING"
   </td>
   <td>Greyscale/dimmed image, border border-gray-800.
   </td>
   <td>Drop Title, Launch Date (e.g., "12 / 05 / 2025").
   </td>
  </tr>
  <tr>
   <td><strong>Archived</strong>
   </td>
   <td>"ARCHIVED"
   </td>
   <td>Low opacity, subdued colors.
   </td>
   <td>Drop Title, <strong>End Date</strong> ("Ended {date}").
   </td>
  </tr>
</table>



### D. Typography



* **Drop Titles:** Use standard bold headers (h3).