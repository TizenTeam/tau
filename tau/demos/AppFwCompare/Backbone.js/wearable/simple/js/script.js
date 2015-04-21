(function($){

  var Item = Backbone.Model.extend({
    defaults: {
      NAME: "Mars",
      ACTIVE: 0,
    }
  });
  Item.metaData = "NBA Player";

  var List = Backbone.Collection.extend({
    model: Item
  });

  // **ListView class**: Our main app view.
  var ListView = Backbone.View.extend({
    el: $("body"),
    // `initialize()`: Automatically called upon instantiation. Where you make all types of bindings, _excluding_ UI events, such as clicks, etc.
    initialize: function(){
      var item,
           element = document.getElementsByClassName("ui-listview")[0];

      _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods

      this.collection = new List(JSON_DATA);
      this.listview = tau.engine.getBinding(element, "Listview");

      this.meta = Item.metaData;

      this.render(); // not all views are self-rendering. This one is.
    },
    // `render()`: Function in charge of rendering the entire view in `this.el`. Needs to be manually called by the user.
    render: function(){
       var template,
           locc = this.collection;

       template = _.template( $('#metaData').html());
       $('.ui-title', this.el).html(template({model: this.meta}));

       template = _.template( $('#artist-list-template').html());
       $('ul', this.el).html(template({collection: this.collection.models}));
    },

  });

  // **listView instance**: Instantiate main app view.
  listView = new ListView();
})(jQuery);