# tools/data/

The one place that reads the data files and checks them against their schemas.

## Rules
- Other modules receive the validated object. They never read `data/` themselves.
- A schema failure must stop the build with the file name and the path of the fault.
