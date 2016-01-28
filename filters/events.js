function (doc, req) {
  var roles = [];
  if (req.userCtx && req.userCtx.roles) {
    roles = req.userCtx.roles;
  }


  if(roles.indexOf('admin') !== -1 || roles.indexOf('watch-event-changes') !== -1) {

    if (doc._deleted === true) {
      // We don't know if it was an event anymore
      return true;
    }

    var interested = req.query.query ? req.query.query.split(',') : null;
    if (!interested || interested.indexOf(doc.eventType) !== -1) {
      if (doc.type && doc.type === "event") {
	  return true;
      }
    }
  }
  return false;
}

