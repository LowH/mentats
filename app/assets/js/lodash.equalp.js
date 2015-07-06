// attach the .equals method to Array's prototype to call it on any array
_.equalp = function (a, b) {
  if (a === b)
    return true;
  if (!a || !b)
    return false;
  if (a.length !== b.length)
    return false;
  for (var i = 0, n = a.length; i < n; i++) {
    if (a[i] instanceof Array && b[i] instanceof Array) {
      if (!_.equalp(a[i], b[i]))
        return false;
    }
    else if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};
