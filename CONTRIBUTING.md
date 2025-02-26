# Contributing
If you would like to contribute, here's some information about the project:

## Guidelines on suggesting new features
If you would like to suggest a feature, feel free to do so! Don't be afraid to make suggestions.
Even if you lack the technical skills to implement, you can use the GitHub issue tracker to make a request for a new feature.
If you do create an issue, make sure to be descriptive.
The more information you give the better others can understand what you are asking for.

## Filing bug reports 
If you encounter a bug, please open an issue on GitHub.

## Guidelines on implementing features
If you would like to implement a new feature, here are some things to keep in mind:

### Use the latest branch
Devel branches are no longer used, instead you should use the latest major version branch for development, unless you are intentionally backporting/bugfixing an older branch.

### Use hooks
AoPS Enhanced has a feature called hooks that makes it easier to create features that instantly toggle on and off.
Your feature should generally be of the form of a IIFE that returns a function, passed to enhanced_settings.add_hook.

For example, for the general layout of a toggleable feature:
```javascript
enhanced_settings.add_hook('feature_setting_name', (() => {
  // Initialize variables such as elements that will be reused.
  // YOUR CODE HERE
  return value => {
    if (value) {
      // Handle enabling the feature
      // YOUR CODE HERE
    } else {
      // Handle disabling the feature
      // YOUR CODE HERE
    }
  };
})(), true);
```

### Clean failure
Your feature should first of all avoid potential errors as much as possible.
In case that is not possible, make sure it does not cause other features to fail.
In particular one of the things to be careful about is when AoPS.Community is not set.

### Implementing old features
Here is a list of some features dropped/not yet implemented in v6 if you feel like implementing them.
* Moderators can edit in locked topics
* Dark themes
* Add custom tags to autotagging
* Read messages deleted while on topic
* Filter out threads with titles matching custom phrases
