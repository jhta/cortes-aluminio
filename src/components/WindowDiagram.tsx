import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/src/hooks/useTheme';
import { formatMeasure, type SystemResult } from '@/src/utils/calculations';

interface WindowDiagramProps {
  results: SystemResult;
  windowWidth: number;
  windowHeight: number;
  alas: number;
}

export function WindowDiagram({
  results,
  windowWidth,
  windowHeight,
  alas,
}: WindowDiagramProps) {
  const { colors, isDark } = useTheme();
  const screen = useWindowDimensions();

  // -- Zoom / pan state --
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTX = useSharedValue(0);
  const savedTY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 0.5), 5);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .minPointers(1)
    .onUpdate((e) => {
      translateX.value = savedTX.value + e.translationX;
      translateY.value = savedTY.value + e.translationY;
    })
    .onEnd(() => {
      savedTX.value = translateX.value;
      savedTY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 250 });
      savedScale.value = 1;
      translateX.value = withTiming(0, { duration: 250 });
      translateY.value = withTiming(0, { duration: 250 });
      savedTX.value = 0;
      savedTY.value = 0;
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // -- Drawing dimensions --
  const sideMargin = 50;
  const maxDrawWidth = screen.width - 40 - sideMargin * 2;
  const maxDrawHeight = 260;

  const ratio = windowWidth / windowHeight;
  let drawW: number;
  let drawH: number;
  if (ratio > maxDrawWidth / maxDrawHeight) {
    drawW = maxDrawWidth;
    drawH = maxDrawWidth / ratio;
  } else {
    drawH = maxDrawHeight;
    drawW = maxDrawHeight * ratio;
  }

  const frame = Math.max(drawW * 0.045, 4);
  const innerW = drawW - frame * 2;
  const innerH = drawH - frame * 2;
  const gap = 2;
  const panelW = (innerW - gap * (alas - 1)) / alas;

  const lineColor = colors.tint;
  const dimColor = colors.tint;
  const frameColor = colors.text;
  const glassColor = isDark ? '#23282c' : '#e8f0f8';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Vista de ventana
      </Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Pellizca para zoom / doble toque para restablecer
      </Text>

      <View style={styles.clipArea}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.zoomLayer, animatedStyle]}>
            <View style={styles.diagram}>
              {/* ---- Top dimension: Cabezal ---- */}
              <View style={[styles.hDim, { width: drawW }]}>  
                <View style={[styles.hDimLine, { backgroundColor: lineColor }]} />
                <View style={[styles.hDimCap, styles.hDimCapLeft, { backgroundColor: lineColor }]} />
                <View style={[styles.hDimCap, styles.hDimCapRight, { backgroundColor: lineColor }]} />
                <View style={styles.hDimLabel}>
                  <Text style={[styles.dimText, { color: dimColor }]}>
                    Cabezal: {formatMeasure(results.cabezal)} cm
                  </Text>
                </View>
              </View>

              {/* ---- Middle: side labels + frame ---- */}
              <View style={styles.middle}>
                {/* Left: Jamba dimension */}
                <View style={[styles.vDim, { height: drawH }]}>  
                  <View style={[styles.vDimLine, { backgroundColor: lineColor }]} />
                  <View style={[styles.vDimCap, styles.vDimCapTop, { backgroundColor: lineColor }]} />
                  <View style={[styles.vDimCap, styles.vDimCapBottom, { backgroundColor: lineColor }]} />
                  <View style={styles.vDimLabel}>
                    <Text style={[styles.dimTextSmall, { color: dimColor }]}>
                      Jamba
                    </Text>
                    <Text style={[styles.dimText, { color: dimColor }]}>
                      {formatMeasure(results.jamba)} cm
                    </Text>
                  </View>
                </View>

                {/* Window frame */}
                <View
                  style={{
                    width: drawW,
                    height: drawH,
                    borderWidth: frame,
                    borderColor: frameColor,
                    borderRadius: 2,
                  }}
                >
                  <View style={styles.panelsRow}>
                    {Array.from({ length: alas }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.panel,
                          {
                            width: panelW,
                            backgroundColor: glassColor,
                            borderColor: frameColor,
                            marginLeft: i > 0 ? gap : 0,
                          },
                        ]}
                      >
                        <Text
                          style={[styles.panelDim, { color: colors.textSecondary }]}
                        >
                          {formatMeasure(results.vidrio_ancho)} x{' '}
                          {formatMeasure(results.vidrio_alto)}
                        </Text>
                        <Text
                          style={[styles.panelName, { color: colors.textSecondary }]}
                        >
                          Vidrio
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Right: total height */}
                <View style={[styles.vDim, { height: drawH }]}>  
                  <View style={[styles.vDimLine, { backgroundColor: lineColor }]} />
                  <View style={[styles.vDimCap, styles.vDimCapTop, { backgroundColor: lineColor }]} />
                  <View style={[styles.vDimCap, styles.vDimCapBottom, { backgroundColor: lineColor }]} />
                  <View style={styles.vDimLabel}>
                    <Text style={[styles.dimTextSmall, { color: dimColor }]}>
                      Alto
                    </Text>
                    <Text style={[styles.dimText, { color: dimColor }]}>
                      {windowHeight} cm
                    </Text>
                  </View>
                </View>
              </View>

              {/* ---- Bottom dimension: Sillar ---- */}
              <View style={[styles.hDim, { width: drawW }]}>  
                <View style={[styles.hDimLine, { backgroundColor: lineColor }]} />
                <View style={[styles.hDimCap, styles.hDimCapLeft, { backgroundColor: lineColor }]} />
                <View style={[styles.hDimCap, styles.hDimCapRight, { backgroundColor: lineColor }]} />
                <View style={styles.hDimLabel}>
                  <Text style={[styles.dimText, { color: dimColor }]}>
                    Sillar: {formatMeasure(results.sillar)} cm
                  </Text>
                </View>
              </View>

              {/* ---- Horizontal piece dimension ---- */}
              <View style={[styles.hDim, { width: drawW * 0.5, marginTop: 4 }]}>  
                <View style={[styles.hDimLine, { backgroundColor: lineColor, opacity: 0.5 }]} />
                <View style={[styles.hDimCap, styles.hDimCapLeft, { backgroundColor: lineColor, opacity: 0.5 }]} />
                <View style={[styles.hDimCap, styles.hDimCapRight, { backgroundColor: lineColor, opacity: 0.5 }]} />
                <View style={styles.hDimLabel}>
                  <Text style={[styles.dimTextSmall, { color: dimColor, opacity: 0.7 }]}>
                    Horizontal: {formatMeasure(results.horizontal)} cm
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 16,
    paddingHorizontal: 18,
  },
  hint: {
    fontSize: 12,
    paddingHorizontal: 18,
    marginTop: 2,
    marginBottom: 12,
  },
  clipArea: {
    overflow: 'hidden',
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  zoomLayer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagram: {
    alignItems: 'center',
  },

  // -- Panels inside the frame --
  panelsRow: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelDim: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  panelName: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },

  // -- Middle row: side dims + frame --
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // -- Horizontal dimension line --
  hDim: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  hDimLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    top: 10,
  },
  hDimCap: {
    position: 'absolute',
    width: 1,
    height: 8,
    top: 7,
  },
  hDimCapLeft: {
    left: 0,
  },
  hDimCapRight: {
    right: 0,
  },
  hDimLabel: {
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    zIndex: 1,
  },

  // -- Vertical dimension line --
  vDim: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vDimLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    left: 21,
  },
  vDimCap: {
    position: 'absolute',
    height: 1,
    width: 8,
    left: 18,
  },
  vDimCapTop: {
    top: 0,
  },
  vDimCapBottom: {
    bottom: 0,
  },
  vDimLabel: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 2,
    zIndex: 1,
  },

  dimText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dimTextSmall: {
    fontSize: 9,
    fontWeight: '500',
  },
});
