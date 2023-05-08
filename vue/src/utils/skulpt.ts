export function SkulptCustomizations() {

    function wait(milliseconds) {
        const start = new Date().getTime();
        let end = start;
        while (end < start + milliseconds) {
          end = new Date().getTime();
        }
    }

    function sleep(milliseconds) {
        const buffer = new SharedArrayBuffer(4);
        const view = new Int32Array(buffer);
        Atomics.wait(view, 0, 0, milliseconds);
    }

    function syncFetch(url, opts) {
        // fetch(url, opts)
        //   .then((response) => response.json())
        //   .then((data) => {
        //     result = data;
        //     done = true;
        //   })
        //   .catch((error) => {
        //     console.error('An error occurred:', error);
        //     result = false;
        //     done = true;
        //   });
      
        // while (!done) {
        //   sleep(100); // sleep for 100 milliseconds
        // }
      
        const xhr = new XMLHttpRequest()

        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState === XMLHttpRequest.DONE) {
        //         if (xhr.responseText) {
        //             window.responseContent = JSON.parse(xhr.responseText)
        //         } else {
        //             window.responseContent = false
        //         }
        //     }
        // }

        xhr.open("POST", url)
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhr.send(JSON.stringify(opts.body))

        console.log("xhr status: ", xhr.status)

        // while (window.responseContent === undefined) {
        //     console.log("responseContent: ", window.responseContent)
        // }

        // console.log("responsecontent: ", window.responseContent)

        return { auth: false } 
    }

    function cyberOrgAuthenticate(username, hash, version) {
        // Sk.builtin.print([""])

        let opts = {
            method: "POST",
            body: JSON.stringify({ username, hash, version }),
            headers: {"Content-Type": "application/json"}
        }

        let response = syncFetch("https://qb-laptop/ddosCyberOrgAuthenticate", opts)
        console.log("syncfetch res: ", response)

        return response.auth
    }
    
    Sk.builtins['cyber_org_authenticate'] = new Sk.builtin.func(function (user, hash, ver) {
        let result = cyberOrgAuthenticate(user.v, hash.v, ver.v)

        return Sk.builtin.bool(result)
    })

    console.log('SK func: ', Sk.builtin)
}