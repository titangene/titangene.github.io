$(function(){document.querySelectorAll("figure.highlight").forEach(e=>{var t=e.parentNode,a=document.createElement("div");t.replaceChild(a,e),a.appendChild(e),a.classList.add("code-highlight"),a.firstChild.insertAdjacentHTML("beforebegin",'\n  <button class="codecopy-btn tooltipped tooltipped-sw" aria-label="Copy to clipboard">\n    <i class="far fa-copy" aria-hidden="true"></i>\n  </button>');var i=(e.classList[1]||"code").toUpperCase();a.setAttribute("data-lang",i)}),new ClipboardJS(".codecopy-btn",{target:e=>e.nextSibling}).on("success",e=>{e.trigger.setAttribute("aria-label","Copied!"),e.clearSelection()}),document.querySelectorAll(".codecopy-btn").forEach(e=>{e.addEventListener("mouseleave",e=>{e.target.setAttribute("aria-label","Copy to clipboard"),e.target.blur()}),e.addEventListener("click",e=>{e.preventDefault()})})});