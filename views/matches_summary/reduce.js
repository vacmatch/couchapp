
function (key, docs, rereduce) {
  if(key[0][0][1] == 0 && docs.length == 1)
    return docs[0];

  return docs.length;
}
