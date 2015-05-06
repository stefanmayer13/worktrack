'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = {
    fetch(url, options) {
        return Rx.Observable.fromPromise(fetch(url, options))
            .flatMap((response) => {
                let data = response.json();
                return Rx.Observable.fromPromise(data);
            });
    }
};
