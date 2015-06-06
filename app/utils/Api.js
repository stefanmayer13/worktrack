'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = {
    fetch(url, options) {
        return Rx.Observable.fromPromise(fetch(url, options)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }
                throw new Error(response.statusText);
            }))
            .flatMap((response) => {
                let data = response.json();
                return Rx.Observable.fromPromise(data);
            });
    }
};
