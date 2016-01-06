# react-native-mapview

React Native MapView component for iOS + Android

## Examples

### MapView Events

The `<MapView />` component and its child components have several events that you can subscribe to.
This example displays some of them in a log as a demonstration.

![](http://i.giphy.com/3o6UBpncYQASu2WTW8.gif) ![](http://i.giphy.com/xT77XVmavQ5Lbfs08w.gif)

Issues: Android doesn't yet support continuous region change events. This will be coming soon.



### Tracking Region / Location

![](http://i.giphy.com/3o6UBoPSLlIKQ2dv7q.gif) ![](http://i.giphy.com/3o6UB6MIdfrtTkEqUE.gif)

Issues: Android doesn't yet support continuous region change events. This will be coming soon.


### Programmatically Changing Region

One can change the mapview's position using refs and component methods, or by passing in an updated 
`region` prop.  The component methods will allow one to animate to a given position like the native 
API could.

![](http://i.giphy.com/3o6UB7poyB6YJ0KPWU.gif) ![](http://i.giphy.com/3o6UB2dztF4OhJKAjm.gif)


### Arbitrary React Views as Markers

![](http://i.giphy.com/xT77XTgnkAsDyJosVO.gif) ![](http://i.giphy.com/3o6UB1qGEM9jYni3KM.gif)

Issues: Updating a sub-view of a marker in iOS right now will render the view in the top left corner
of the screen until the MapView is interacted with again. Currently looking for the reason and a 
potential fix.



### Using the MapView with the Animated API

The `<MapView />` component can be made to work with the Animated API, having the entire `region` prop
be declared as an animated value. This allows one to animate the zoom and position of the MapView along
with other gestures, giving a nice feel.

Further, Marker views can use the animated API to enhance the effect.

![](http://i.giphy.com/xT77XMw9IwS6QAv0nC.gif) ![](http://i.giphy.com/3o6UBdGQdM1GmVoIdq.gif)

Issue: Since android needs to render its marker views as a bitmap, the animations APIs may not be 
compatible with the Marker views. Not sure if this can be worked around yet or not.



### Polygon Creator

![](http://i.giphy.com/3o6UAZWqQBkOzs8HE4.gif) ![](http://i.giphy.com/xT77XVBRErNZl3zyWQ.gif)



### Other Overlays

So far, `<Circle />`, `<Polygon />`, and `<Polyline />` are available to pass in as children to the
`<MapView />` component.

![](http://i.giphy.com/xT77XZCH8JpEhzVcNG.gif) ![](http://i.giphy.com/xT77XZyA0aYeOX5jsA.gif)



### Default Markers

Default markers will be rendered unless a custom marker is specified. One can optionally adjust the
color of the default marker by using the `pinColor` prop.

![](http://i.giphy.com/xT77Y0pWKmUUnguHK0.gif) ![](http://i.giphy.com/3o6UBfk3I58VIwZjVe.gif)



### Custom Callouts

Callouts to markers can be completely arbitrary react views, similar to markers.  As a result, they 
can be interacted with like any other view.

Additionally, you can fall back to the standard behavior of just having a title/description through
the `<Marker />`'s `title` and `description` props.

Custom callout views can be the entire tooltip bubble, or just the content inside of the system
default bubble.

![](http://i.giphy.com/xT77XNePGnMIIDpbnq.gif)

Issues: Android custom callouts seem to be getting sized improperly right now. Working on a fix.



### Image-based Markers

Markers can be customized by just using images, and specified using the `image` prop.

NOTE: this isn't implemented properly yet.





## Component API



## Using with the Animated API


## Remaining Issues


## Discussion Points



