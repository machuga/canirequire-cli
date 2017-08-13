const request = require('request');

const fetchModules = () => (
  new Promise((resolve, reject) => {
    request({
      url: 'https://webtask.it.auth0.com/api/run/wt-tehsis-gmail_com-1',
      method: 'POST',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiJmZGZiOWU2MjQ0YjQ0YWYyYjc2YzAwNGU1NjgwOGIxNCIsImlhdCI6MTQzMDMyNjc4MiwiY2EiOlsiZDQ3ZDNiMzRkMmI3NGEwZDljYzgwOTg3OGQ3MWQ4Y2QiXSwiZGQiOjAsInVybCI6Imh0dHA6Ly90ZWhzaXMuZ2l0aHViLmlvL3dlYnRhc2tpby1jYW5pcmVxdWlyZS90YXNrcy9saXN0X21vZHVsZXMuanMiLCJ0ZW4iOiIvXnd0LXRlaHNpcy1nbWFpbF9jb20tWzAtMV0kLyJ9.MJqAB9mgs57tQTWtRuZRj6NCbzXxZcXCASYGISk3Q6c'
      },
    }, function(err, response, body) {
      if (err) { return reject(err); }

      resolve(response);
    })
  }).then(res => JSON.parse(res.body))
  .then(data => data.modules)
);

const groupModules = modules => modules.reduce((acc, m) => {
  if (! acc[m.name]) {
    acc[m.name] = [];
  }

  acc[m.name].push(m.version);

  return acc;
}, {});

const search = term => {
  if (! term) {
    return modules => modules;
  }

  const termRegex = term ? new RegExp(term, 'i') : undefined;

  return modules => (
    Object.keys(modules)
      .filter(name => termRegex.test(name))
      .reduce((acc, name) => { 
        acc[name] = modules[name];
        return acc;
      }, {})
  );
}

const getModules = (searchTerm) => fetchModules().then(groupModules).then(search(searchTerm))

getModules(process.argv[process.argv.length - 1])
  .then(x => JSON.stringify(x, null, ' '))
  .then(console.log)
  .catch(console.error);
