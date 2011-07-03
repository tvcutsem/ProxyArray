Based on David Bruant's [self-hosted implementation](https://github.com/DavidBruant/ProxyArray)
of Arrays in Javascript using Proxies, this little experiment
extends Proxies with Fixed Properties, as per this [strawman](http://wiki.ecmascript.org/doku.php?id=strawman:fixed_properties).

It then goes on to show that Arrays can still be self-hosted,
even with Proxies with Fixed Properties.

The Array's `writable:true, configurable:false` "length" property
can be faithfully emulated.