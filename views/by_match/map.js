function(doc) {
    if(typeof doc.type !== "undefined" && typeof doc.match !== "undefined") {
        emit([doc.match, doc.type, doc.date], { "_id": doc._id });
	if (doc.type == "event") {
		emit([doc.match, "team"], {_id: doc.team});
		emit([doc.match, "player"], {_id: doc.player});
		emit([doc.match, "match"], {_id: doc.match});
	}
    }
}
