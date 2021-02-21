window.onload = function(){
    const editMde = new SimpleMDE({
        element: document.getElementById('desc_desc'),
        initialValue: '',
        hideIcons: ['guide', 'fullscreen', 'side-by-side'],
        // guide implmentation is open to you
        // fullscreen and sxs muss up layout
        spellChecker: false, 
      });
      
}