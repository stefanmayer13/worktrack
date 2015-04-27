'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = {
    fetch(url) {
        return Rx.Observable.fromPromise(fetch(url))
            .flatMap((response) => {
                let data = response.json();
                return Rx.Observable.fromPromise(data);
            });
    }
};
