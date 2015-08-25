(function($){

  var Item = Backbone.Model.extend({
//    defaults: {
//      NAME: "Mars",
//      ACTIVE: 0,
//    }
  });
  Item.metaData = "NBA Player";

  var List = Backbone.Collection.extend({
    model: Item
  });

  // **ListView class**: Our main app view.
  var ListView = Backbone.View.extend({
    el: $("body"),

    events: {
        'click button#test': 'testPerformance'
    },

    // `initialize()`: Automatically called upon instantiation. Where you make all types of bindings, _excluding_ UI events, such as clicks, etc.
    initialize: function(){
      var item,
           element = document.getElementsByClassName("ui-listview")[0];

      _.bindAll(this, 'render', 'testPerformance'); // fixes loss of context for 'this' within methods

      this.meta = Item.metaData;


      this.render(); // not all views are self-rendering. This one is.
    },
    // `render()`: Function in charge of rendering the entire view in `this.el`. Needs to be manually called by the user.
    render: function(){
       var template;
       template = _.template( $('#metaData').html());
       $('.ui-title', this.el).html(template({model: this.meta}));
    },
    testPerformance: function(){
        var template = _.template( $('#artist-list-template').html()),
            list = tau.widget.Listview(document.getElementsByClassName("ui-listview")[0]);

        console.time("test");
        this.collection = new List(JSON_DATA);
        $('ul', this.el).html(template({collection: this.collection.models}));
        list.refresh();
        console.timeEnd("test");
    },

  });

  // **listView instance**: Instantiate main app view.
  listView = new ListView();
})(jQuery);