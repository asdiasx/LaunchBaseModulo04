const fs = require("fs");
const data = require("./data.json");
const { age, date } = require("./utils");

// show
exports.show = function (req, res) {
  const { id } = req.params;

  const foundInstructor = data.instructors.find(function (instructor) {
    return instructor.id == id;
  });
  if (!foundInstructor) return res.send("Instructor not found!");

  const instructor = {
    ...foundInstructor,
    age: age(foundInstructor.birth),
    services: foundInstructor.services.split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
  };

  return res.render("instructors/show", { instructor });
};

// create
exports.post = function (req, res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      res.send("Please, fill all fields!");
    }
  }

  let { avatar_url, name, birth, gender, services } = req.body;

  birth = Date.parse(birth);
  created_at = Date.now();
  id = Number(data.instructors.length + 1);

  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write error!");

    return res.redirect("/instructors");
  });
  // return res.send(req.body);
};

// edit
exports.edit = function (req, res) {
  const { id } = req.params;

  const foundInstructor = data.instructors.find(function (instructor) {
    return instructor.id == id;
  });
  if (!foundInstructor) return res.send("Instructor not found!");

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth),
  };

  return res.render("instructors/edit", { instructor });
};

//put
exports.put = function (req, res) {
  // return res.send("aqui");
  // const keys = Object.keys(req.body);

  // for (key of keys) {
  //   if (req.body[key] == "") {
  //     res.send("Please, fill all fields!");
  //   }
  // }
  let index = 0;
  const foundInstructor = data.instructors.find(function (instructor, foundIndex) {
    if (instructor.id == req.body.id) {
      index = foundIndex;
      return true;
    }
  });
  if (!foundInstructor) return res.send("Instructor not found!");

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth),
  };

  data.instructors[index] = instructor;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("Write error!");

    return res.redirect(`/instructors/${req.body.id}`);
    // return res.send(instructor);
  });
  // return res.send(req.body);
};