'use strict';

import axios from 'axios';
import { parseString } from 'xml2js';

( async function () {
  const { data: xML } = await axios.get('https://www.bbcgoodfood.com/sitemaps/2008-Q1-recipe.xml')

  const parsedXML = parseString(xML)
  console.log(parsedXML)
})()


