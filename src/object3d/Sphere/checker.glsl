float checker(vec2 uv, float checkerSize) {
  float xChecker = mod(floor(uv.x / checkerSize), 2.0);
  float yChecker = mod(floor((uv.y + checkerSize) / checkerSize), 2.0);

  if (xChecker == yChecker) {
    return 1.0;
  }

  return 0.0;
}

#pragma glslify: export(checker);
