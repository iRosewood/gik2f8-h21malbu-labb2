class Api{
  url='';

  constructor(url){
      this.url = url;
  }

  create(data){
      const JSONdata = JSON.stringify(data);
      const request = new Request(this.url,{
          method: 'POST',
          body: JSONdata,
          headers:{'content-type': 'application/json'}
      });

      return fetch(request)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  update(id){
      console.log(`Uppdating task with id: ${id}`);
      return fetch(`${this.url}/${id}`, {
          method: 'PUT'})
          .then((result) => result.json())
          .catch((err) => console.log(err));

  }

  getAll(){
      return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
      
  }


  remove(id){
      console.log(`Removing task with id: ${id}`);

      return fetch(`${this.url}/${id}`, {
          method: 'DELETE'})
          .then((result) => result.json())
          .catch((err) => console.log(err));
  }

}