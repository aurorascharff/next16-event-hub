# Speaker Notes

---

Hi everyone! I'm Aurora Scharff, a DX Engineer at Vercel. I'm really excited to be here at React Miami — let's get into it.

---

Let's look at the React render cycle to understand where Async React fits into this in practice. In a React user interaction, we have an event like a user click, which triggers an update, which causes a re-render, which is then committed to DOM.

---

Now, bring async functions into this. The user clicked something, which triggered an async update — a "busy" state. Then, after the Update, there's another async call to load some more data, causing a "loading" state. After Render, a "done" state before Commit. These in-between states are what make the app feel broken.

---

The key to Async React is transitions. A transition coordinates the async work, and will ensure the render and commit cycle happens smoothly. It batches all of the updates together as an "Action", and commits them when they are all done, avoiding weird flickers in the UI.

---

Then, we can decide what user interaction is most suitable for the event that happened. We could add optimistic updates to the event step — when we do this, it will be coordinated with the transition. We can also add Suspense to define the loading step. And finally, we can add View Transitions to the commit step.

---

The real magic with this model is that when we have asynchronous operations that take very little time to complete, the whole interaction feels as if it was synchronous. I basically just copied this visual from the Async React talk last year at React Conf, so if you're interested in learning more here, check that out. Now let's go fix the app.
