package alx.ru.opengl

import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.opengl.Matrix
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import java.nio.ShortBuffer
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10

class MainActivity : AppCompatActivity() {
    private lateinit var glView:GLSurfaceView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        glView = MyGLSurfaceView(this);
        setContentView(glView)
    }

    class MyGLSurfaceView(mainActivity: MainActivity) : GLSurfaceView(mainActivity) {
        private val renderer:Renderer

        init {
            // Create an OpenGL ES 2.0 context
            setEGLContextClientVersion(2)

            renderer = MyGLRenderer()
            // Set the Renderer for drawing on the GLSurfaceView
            setRenderer(renderer)
//            renderMode = GLSurfaceView.RENDERMODE_WHEN_DIRTY
        }
    }

    class MyGLRenderer : GLSurfaceView.Renderer {
        private lateinit var mTriangle: Triangle
//        private lateinit var mSquare: Square

        private val mvpMatrix = FloatArray(16)
        private val projectionMatrix = FloatArray(16)
        private val viewMatrix = FloatArray(16)


        override fun onSurfaceChanged(unused: GL10?, width: Int, height: Int) {
            GLES20.glViewport(0, 0, width, height)
            val ratio: Float = width.toFloat() / height.toFloat()
            Matrix.frustumM(projectionMatrix, 0, -ratio, ratio, -1f, 1f, 3f, 7f)
        }

        override fun onDrawFrame(unused: GL10?) {
            GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT)

            Matrix.setLookAtM(viewMatrix, 0, 0f, 0f, -3f, 0f, 0f, 0f, 0f, 1.0f, 0.0f)
            Matrix.multiplyMM(mvpMatrix, 0, projectionMatrix, 0, viewMatrix, 0)

            mTriangle.draw(mvpMatrix)
        }

        override fun onSurfaceCreated(unused: GL10?, config: EGLConfig) {
            mTriangle = Triangle()
            GLES20.glClearColor(0.1f, 0.1f, 0.4f, 1.0f)
        }
    }



    class Triangle {
        private val vertexShaderCode =
                // This matrix member variable provides a hook to manipulate
                // the coordinates of the objects that use this vertex shader
                "uniform mat4 uMVPMatrix;" +
                        "attribute vec4 vPosition;" +
                        "void main() {" +
                        // the matrix must be included as a modifier of gl_Position
                        // Note that the uMVPMatrix factor *must be first* in order
                        // for the matrix multiplication product to be correct.
                        "  gl_Position = uMVPMatrix * vPosition;" +
                        "}"

        private val fragmentShaderCode =
                "precision mediump float;" +
                        "uniform vec4 vColor;" +
                        "void main() {" +
                        "  gl_FragColor = vColor;" +
                        "}"

        var triangleCoords = floatArrayOf(     // in counterclockwise order:
                0.0f, 0.622008459f, 0.0f,      // top
                -0.5f, -0.311004243f, 0.0f,    // bottom left
                0.5f, -0.311004243f, 0.0f      // bottom right
        )
        val COORDS_PER_VERTEX = 3
        val color = floatArrayOf(0.63671875f, 0.76953125f, 0.22265625f, 1.0f)
        private var program: Int
        private var positionHandle: Int = 0
        private var colorHandle: Int = 0
        private var mvpMatrixHandle: Int = 0
        private val vertexCount: Int = triangleCoords.size
        private val vertexStride: Int = COORDS_PER_VERTEX * 4
        private var vertexBuffer: FloatBuffer =
        // (number of coordinate values * 4 bytes per float)
                ByteBuffer.allocateDirect(triangleCoords.size * 4).run {
                    // use the device hardware's native byte order
                    order(ByteOrder.nativeOrder())

                    // create a floating point buffer from the ByteBuffer
                    asFloatBuffer().apply {
                        // add the coordinates to the FloatBuffer
                        put(triangleCoords)
                        // set the buffer to read the first coordinate
                        position(0)
                    }
                }

        init {
            val vertexShader: Int = loadShader(GLES20.GL_VERTEX_SHADER, vertexShaderCode)
            val fragmentShader: Int = loadShader(GLES20.GL_FRAGMENT_SHADER, fragmentShaderCode)

            // create empty OpenGL ES Program
            program = GLES20.glCreateProgram().also {

                // add the vertex shader to program
                GLES20.glAttachShader(it, vertexShader)

                // add the fragment shader to program
                GLES20.glAttachShader(it, fragmentShader)

                // creates OpenGL ES program executables
                GLES20.glLinkProgram(it)
            }
        }

        fun draw(mvpMatrix: FloatArray) {
            GLES20.glUseProgram(program)

            positionHandle = GLES20.glGetAttribLocation(program, "vPosition").also {

                // Enable a handle to the triangle vertices
                GLES20.glEnableVertexAttribArray(it)

                // Prepare the triangle coordinate data
                GLES20.glVertexAttribPointer(
                        it,
                        COORDS_PER_VERTEX,
                        GLES20.GL_FLOAT,
                        false,
                        vertexStride,
                        vertexBuffer
                )

                colorHandle = GLES20.glGetUniformLocation(program, "vColor").also { colorHandle ->
                    GLES20.glUniform4fv(colorHandle, 1, color, 0)
                }

                mvpMatrixHandle = GLES20.glGetUniformLocation(program, "uMVPMatrix")
                GLES20.glUniformMatrix4fv(mvpMatrixHandle, 1, false, mvpMatrix, 0)
                GLES20.glDrawArrays(GLES20.GL_TRIANGLES, 0, vertexCount)
                GLES20.glDisableVertexAttribArray(positionHandle)
            }
        }
    }

//    class Square {
//        var squareCoords = floatArrayOf(
//                -0.5f,  0.5f, 0.0f,      // top left
//                -0.5f, -0.5f, 0.0f,      // bottom left
//                0.5f, -0.5f, 0.0f,      // bottom right
//                0.5f,  0.5f, 0.0f       // top right
//        )
//
//        private val drawOrder = shortArrayOf(0, 1, 2, 0, 2, 3)
//
//        private val vertexBuffer:FloatBuffer = ByteBuffer.allocateDirect(squareCoords.size * 4).run {
//            order(ByteOrder.nativeOrder())
//            asFloatBuffer().apply {
//                put(squareCoords)
//                position(0)
//            }
//        }
//
//        private val drawListBuffer: ShortBuffer = ByteBuffer.allocateDirect(drawOrder.size * 2).run {
//            order(ByteOrder.nativeOrder())
//            asShortBuffer().apply {
//                put(drawOrder)
//                position(0)
//            }
//        }
//    }
}

fun loadShader(type: Int, shaderCode: String): Int {
    return GLES20.glCreateShader(type).also { shader ->
        GLES20.glShaderSource(shader, shaderCode)
        GLES20.glCompileShader(shader)
    }
}
