#pragma once
#include <cmath>

namespace RNMapsUserTrackingMath {
inline double delta(double from, double to) {
  double result = std::fmod(to - from, 360.0);
  if (result > 180.0) result -= 360.0;
  if (result < -180.0) result += 360.0;
  return result;
}
inline double normalize(double angle) {
  return std::fmod(std::fmod(angle, 360.0) + 360.0, 360.0);
}
inline double factor(double seconds) {
  return 1.0 - std::exp(-std::fmin(0.1, std::fmax(0.0, seconds)) / 0.12);
}
}
