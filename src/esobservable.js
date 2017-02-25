// build-dependencies: core

function ESObservable(observable) {
  this.observable = observable;
}

ESObservable.prototype.subscribe = function(observer) {
  const subscription = {
    closed: false,
    unsubscribe: function() {
      subscription.closed = true;
      cancel();
    }
  };

  const cancel = this.observable.subscribe(function(event) {
    if (event.isError()) {
      if (observer.error) observer.error(event.error);
      subscription.unsubscribe();
    } else if (event.isEnd()) {
      if (observer.complete) observer.complete();
      subscription.unsubscribe();
    } else if (observer.next) {
      observer.next(event.value());
    }
  });
  return subscription;
};

ESObservable.prototype[symbol('observable')] = function() {
  return this;
};

Bacon.Observable.prototype[symbol('observable')] = function() {
  return new ESObservable(this);
};
