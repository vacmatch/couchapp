// sample generated by caster.py : https://github.com/vivekpathak/casters
// modify/adapt/copy as needed

function(doc) {
  if(typeof doc.type !== "undefined") {
    if(doc.type == 'match') {
      emit([doc._id, 0], { "_id": doc._id });
    }
    else if(doc.type == 'event') {
      emit([doc.match, doc.team, doc.eventType, doc.date], { "_id": doc._id });
    }
  }
}