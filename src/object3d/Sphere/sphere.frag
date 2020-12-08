#define MATCAP

// custom defines
#define TWO_PI 6.283185307179586
// custom defines end

uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;

// custom uniforms
uniform float time;
// custom uniforms end

// custom varying
varying vec2 vUv;
// custom varying end

varying vec3 vViewPosition;
#ifndef FLAT_SHADED
  varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <fog_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

// glslify imports
#pragma glslify: checkerPattern = require('./checker.glsl')
// glslify imports end

void main() {
  #include <clipping_planes_fragment>
  vec4 diffuseColor = vec4( diffuse, opacity );
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  vec3 viewDir = normalize( vViewPosition );
  vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
  vec3 y = cross( viewDir, x );
  vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks
  #ifdef USE_MATCAP
    vec4 matcapColor = texture2D( matcap, uv );
    matcapColor = matcapTexelToLinear( matcapColor );
  #else
    vec4 matcapColor = vec4( 1.0 );
  #endif

  vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

  float checkcerAmount = dot(vViewPosition, vec3(0.0, 1.0, 0.0)) * 0.2 + 0.3;

  // custom glsl start
  outgoingLight.rgb += checkerPattern(vUv, 0.03) * checkcerAmount;
  // custom glsl end

  
  gl_FragColor = vec4( outgoingLight, diffuseColor.a );
  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}
