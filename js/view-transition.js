window.addEventListener('pagereveal', async (event) => {
        // console.log('!!! ' + event.viewTransition)
    if (!event.viewTransition) return;

    const viewType = localStorage.getItem('viewType');
    
    if (viewType) {
        // Add the type (next or prev) to the transition
        event.viewTransition.types.add(viewType);
        // Clean up immediately so the next navigation (like Back button) 
        // doesn't accidentally reuse the same animation.
        await event.viewTransition.finished;
        localStorage.removeItem('viewType');
    }
    // else {
    //   // Do a reload animation
    //   if (navigation.activation.navigationType == 'reload') {
    //     const t = document.startViewTransition({
    //       update: () => {
    //         // NOOP
    //       },
    //       types: ['reload'],
    //     });
    //   }
    // }

});