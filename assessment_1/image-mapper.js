/*********** Image Uploading Starts Here ***********/

document.querySelector('#fileUpload').addEventListener('change', event => {
  imageUpload(event)
})


const imageUpload = event => {
  let fileTag = document.getElementById("fileUpload"),
      txt = "",
      preview = document.getElementById("preview");
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;


  if ('files' in fileTag) {

    if (!allowedExtensions.exec(fileTag.value)) {
        alert('Please select a valid image file type.');
        fileTag.value = '';
        return false;
    }
    else {
     document.getElementById('imageWrapper').style.display='block';
     document.getElementById('proWrapper').style.display='block';

     var reader, dimensions;
     var _Svg = document.getElementById('svgBody');
     _Svg.innerHTML='';

	  if (fileTag.files && fileTag.files[0]) {
	    reader = new FileReader();

	    reader.onload = function(e) {
	 	preview.setAttribute('src', e.target.result);
	    	var img = new Image;
		    img.onload = function() {
		       const dimensions= img.width +' x '+img.height;
		     document.getElementById('idim').innerHTML=dimensions;
		    };
		     img.src = reader.result;
	    }
	    reader.readAsDataURL(fileTag.files[0]);
	  }
      for (var i = 0; i < fileTag.files.length; i++) {
        var file = fileTag.files[i];
        if ('name' in file)
        	document.getElementById('iname').innerHTML=file.name;
        if ('type' in file)
        	document.getElementById('itype').innerHTML=file.type;
      }
    }
  }


/*********** Image Uploading Ends Here ***********/

/*********** Svg Plotting and Capturing Description Details  Starts Here ***********/

  document.getElementById('previewDiv').addEventListener('click', function (event) {
    var img = document.getElementById('preview');
    document.getElementById('detailsWrapper').style.display='block';
    bounds=img.getBoundingClientRect();
    var left=bounds.left;
    var top=bounds.top;
    var x = event.pageX - left;
    var y = event.pageY - top;
    var cw=img.clientWidth
    var ch=img.clientHeight
    var iw=img.naturalWidth
    var ih=img.naturalHeight
    var px=x/cw*iw
    var py=y/ch*ih
    var desc = prompt("Description", "");

	  if (desc != null) {
	  	 var cellAttr = [];
	  	cellAttr.push(px.toFixed(0),py.toFixed(0),desc);
	  	var arrLen = cellAttr.length;

	    var tableRef = document.getElementById('bodyTable').getElementsByTagName('tbody')[0];
		var newRow   = tableRef.insertRow();

		for(var i=0; i<arrLen; i++)
		{
			var newCell  = newRow.insertCell(i);
			newCell.appendChild(document.createTextNode(cellAttr[i]));
		}
		var _Svg = document.getElementById('svgBody');
		_Svg.style.cssText = "top:"+ img.offsetTop+"; left: "+img.offsetLeft+";"
	    _Svg.innerHTML += '<circle cx='+x+ ' cy='+y+ ' r="4" stroke="red" stroke-width="1" fill="red"><title>'+desc+'</title></circle>';
	  }

  });
  /*********** Svg Plotting and Capturing Description Details  Ends Here ***********/
}
