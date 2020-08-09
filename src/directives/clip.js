import Axios from "axios";

export default {
  inserted(el, binding) {
    el.addEventListener('click', (e) => {
      copy(el, binding)
    })

    async function copy(el, binding) {
      let textarea = document.createElement('textarea')
      let value
      if (binding.arg === 'ajax') {
        let res = await Axios.get(`/user/getUserAllURL?type=${el.dataset.uimclip}`, {
          withCredentials: true
        })
        console.log(res);
        value = res.data
      } else {
        value = el.dataset.uimclip
      }
      textarea.value = value
      el.after(textarea)
      textarea.focus()
      textarea.setSelectionRange(0, value.length)
      document.execCommand('copy')
      textarea.remove();
      binding.value.onSuccess();
    }
  }
}