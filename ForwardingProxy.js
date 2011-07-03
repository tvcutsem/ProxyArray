"use strict";

function handlerMaker(obj) {
  return {
   getOwnPropertyDescriptor: function(name) {
     return Object.getOwnPropertyDescriptor(obj, name);
   },
   
   getPropertyDescriptor: function(name) {
     var objectToInspect;
     var desc;

     for(objectToInspect = obj;
         objectToInspect !== null; 
         objectToInspect = Object.getPrototypeOf(objectToInspect)) {
       desc = Object.getOwnPropertyDescriptor(objectToInspect, name);
       if (desc !== undefined) { return desc; } 
     }
     return undefined;
   },
   
   getOwnPropertyNames: function() {
     return Object.getOwnPropertyNames(obj);
   },
   
   getPropertyNames: function() {
     return this.getOwnPropertyNames(); // incorrect !
   },
   
   defineProperty: function(name, desc) {
     Object.defineProperty(obj, name, desc);
     //NOTE(tvcutsem): for the fixed properties strawman,
     // defineProperty should return the defined descriptor
     return desc;
   },
   
   delete: function(name) { 
     return delete obj[name]; 
   },
      
   fix: function() {
     if (Object.isFrozen(obj)) {
       return Object.getOwnPropertyNames(obj).map(function(name) {
         return Object.getOwnPropertyDescriptor(obj, name);
       });
     }
     // As long as obj is not frozen, the proxy won't allow itself to be fixed
     return undefined; // will cause a TypeError to be thrown
   },
   
   // NOTE(tvcutsem): added get and set traps with default behavior
   
   get: function(rcvr, name) {
     var desc = this.getPropertyDescriptor(name);
     if (desc !== undefined) {
       if ('value' in desc) {
         return desc.value;
       } else {
         if (desc.get === undefined) { return undefined; }
         return desc.get.call(rcvr);
       }
     }
     return undefined;
   },
   set: function(rcvr, name, val) {
     var desc = this.getOwnPropertyDescriptor(name);
     if (desc) {
       if ('writable' in desc) {
         if (desc.writable) {
           desc.value = val;
           this.defineProperty(name, desc);
           return true;
         } else {
           return false;
         }
       } else { // accessor
         if (desc.set) {
           desc.set.call(rcvr, val);
           return true;
         } else {
           return false;
         }
       }
     }
     desc = this.getPropertyDescriptor(name);
     if (desc) {
       if ('writable' in desc) {
         if (desc.writable) {
           // fall through
         } else {
           return false;
         }
       } else { // accessor
         if (desc.set) {
           desc.set.call(rcvr, val);
           return true;
         } else {
           return false;
         }
       }
     }
     this.defineProperty(name, {
       value: val, 
       writable: true, 
       enumerable: true, 
       configurable: true});
     return true;   }
  };
}

