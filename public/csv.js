(() => {
"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

const resultTemplate = `
<div class="contenido">
      <table class="center" id="result">
          <% _.each(rows, (row) => { %>
          <tr class="<%=row.type%>">
              <% _.each(row.items, (name) =>{ %>
              <td><%= name %></td>
              <% }); %>
          </tr>
          <% }); %>
      </table>
  </p>
</div>
`;

// Volcamos la tabla con el resultado en el HTML
const fillTable = (data) => { 
  $("#finaltable").html(_.template(resultTemplate, { rows: data.rows })); 
};

// Se vuelca el contenido del fichero fileName
const dump = (fileName) => {
  $.get(fileName, function (data) {
      $("#original").val(data);
  });
};
 
const handleFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

 var files = evt.target.files; 

  var reader = new FileReader();
  reader.onload = (e) => {
  
    $("#original").val(e.target.result);
  };
  reader.readAsText(files[0])
}

// Drag and drop para la textarea
const handleDragFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files;

  var reader = new FileReader();
  reader.onload = (e) => {
  
    $("#original").val(e.target.result);
    evt.target.style.background = "white";
  };
  reader.readAsText(files[0])
}

const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.target.style.background = "yellow";
}

$(document).ready(() => {
    let original = document.getElementById("original");  
    if (window.localStorage && localStorage.original) {
      original.value = localStorage.original;
    }
    $("#parse").click( () => {
        if (window.localStorage) localStorage.original = original.value;
        $.get("/csv",
          { input: original.value }, 
          fillTable,
          'json'
        );
   });
   // Botones para la textarea
   $('button.example').each( (_,y) => {
     $(y).click( () => { dump(`${$(y).text()}.txt`); });
   });

    let dropZone = $('.drop_zone')[0];
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleDragFileSelect, false);
    let inputFile = $('.inputfile')[0];
    inputFile.addEventListener('change', handleFileSelect, false);
 });
})();
