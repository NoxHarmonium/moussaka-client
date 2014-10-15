#!/bin/bash
if [[ -z "$TRAVIS" ]];
then
    export COVERALLS_SERVICE_NAME="Adhoc Test Machine";
    export COVERALLS_REPO_TOKEN="VLEaloUrUr3sm3cr12OR8kWszvBIVtIsH";
    echo "Not on Travis CI? The the correct ENV vars have been set for you.";
else
    echo "Coveralls info is already set. This should be so on Travis CI."
fi

FILES="tests/test.js"
istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -t 30000 -R spec -b $FILES && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage
