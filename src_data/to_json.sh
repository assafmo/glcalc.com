#!/bin/bash

ls *zip | parallel 'zcat {} | csvtojson | jq ".[]"' | jq -s . > gi_full.json