#include <iostream>

#ifdef LINUX
//Linux Headers
#include <GL/gl.h>
#include <GL/glu.h>
#include <GL/glut.h>
#endif

#include <fstream>
#include <vector>

using namespace std;

GLfloat updateRate = 20.0; // Change this later

class Vertex{
public:   
 GLfloat x,y,z;
};

class Face{
public:
    int a,b,c,normalIdxA,normalIdxB,normalIdxC,texA,texB,texC;
    int material;
};

class Normal: public Vertex{

};

class Material{
public:
    GLfloat sr,sg,sb,ar,ag,ab,dr,dg,db,er,eg,eb,shiny,transparency;
};


vector<Material> materials;
vector<Vertex> verticies;
vector<Normal> normals;
vector<Face> faces;

void loadModel(){
//open file
  ifstream inputFile ("jet.obj");

  string line;
  int currMaterial = 0;

  if(inputFile.is_open())
    {
      while(inputFile.good())
        {
          getline(inputFile, line);

          if(line[0] == 'u')
            {
              sscanf(line.c_str(), "usemtl %d", &currMaterial);
            }

          //process vertex
          else if(line[0] == 'v' && line[1] == ' ')
            {
              Vertex vert;
              sscanf(line.c_str(), "%*s %f %f %f", &vert.x, &vert.y, &vert.z);
              verticies.push_back(vert);
              //cout << "Vertex! ";
            }
          //process normal
          else if(line[0] == 'v' && line[1] == 'n')
            {
              Normal normal;
              sscanf(line.c_str(), "%*s %f %f %f", &normal.x, &normal.y, &normal.z);
              normals.push_back(normal);
            }
          

          //process face
          else if(line[0] == 'f')
            {
              size_t first;
              size_t second;

              Face tri;

              tri.material = currMaterial;

              first = line.find("/");
              second = line.find("/", first+1);


              if(second - first == 1) //then there isn't texture data
                {
                  sscanf(line.c_str(), "%*s %d//%d %d//%d %d//%d" , &tri.a, &tri.normalIdxA, &tri.b, &tri.normalIdxB, &tri.c, &tri.normalIdxC);

                }
              else //there is texture data
                {
                  sscanf(line.c_str(), "%*s %d/%d/%d %d/%d/%d %d/%d/%d" , &tri.a, &tri.texA, &tri.normalIdxA, &tri.b, &tri.texB, &tri.normalIdxB, &tri.c, &tri.texC, &tri.normalIdxC);

                }
              //cout << "Triangle: " << tri.a << ", " << tri.b << ", " << tri.c << endl;
              //cout << line << endl;

	      tri.a -= 1;
	      tri.b -=1; 
              tri.c -=1;
	      tri.normalIdxA -=1;
	      tri.normalIdxB -=1;
	      tri.normalIdxC -=1;

              faces.push_back(tri);

            }
        }
    }

}



// code to read the obj file
void Read()
{
  ifstream ifs("jet.obj");
  if (!ifs) return;
  while(ifs)
    {
      string header;
      ifs >> header;
      if (header == string("mtllib"))
        {
          string mtllib;
          ifs >> mtllib;
          cout << header << " " << mtllib << endl;
        }
      else if (header == string("v"))
        {
          float v[3];
          ifs >> v[0] >> v[1] >> v[2];
          cout << header << " " << v[0] << " " << v[1] << " " << v[2] << endl;
        }
      else if (header == string("vn"))
        {
          // more here
        }
    }
}

// Code to read material file
void loadMaterials()
{
  ifstream ifs("jet.mtl");
  if (!ifs) return;
  cout.precision(4);
  Material currMaterial;
  while(ifs)
    { 
      string header;
      ifs >> header;
      if (header == string("newmtl"))
        {
          int n;
          ifs >> n;
	  //currMaterial = new Material;
	  //currMaterial.
          cout << header << " " << n << endl;
        }
      else if (header == string("Ns"))
        {
          float Ns;
          ifs >> Ns;
	  currMaterial.shiny = Ns;
          cout << header << " " << Ns << endl;
        }
      else if (header == string("Tr"))
        {
           float Tr;
	   ifs >> Tr;
 	   currMaterial.transparency = Tr;;
            
          // more here
        }
      else if (header == string("Ka")){
	    float ka1,ka2,ka3;
	    ifs >> ka1 >> ka2 >> ka3;
	    currMaterial.ar = ka1;
	    currMaterial.ag = ka2;
	    currMaterial.ab = ka3;

      }else if(header == string("Kd")){
	    float kd1,kd2,kd3;
	    ifs >>kd1>>kd2>>kd3;
	    currMaterial.dr = kd1;
	    currMaterial.dg = kd2;
	    currMaterial.db = kd3;

      }else if(header == string("Ks")){
	    float ks1,ks2,ks3;
	    ifs>>ks1 >> ks2 >>ks3;
	    currMaterial.sr = ks1;
	    currMaterial.sg = ks2;
	    currMaterial.sb = ks3;

      }else if (header == string("Ke")){
	    float ke1,ke2,ke3;
	    ifs>>ke1>>ke2>>ke3;
	    currMaterial.er = ke1;
	    currMaterial.eg = ke2;
 	    currMaterial.eb = ke3;
	    materials.push_back(currMaterial);
      }

	
    }
  
}

void setMaterial(int materialId)
{
  float specular[4];
  float ambient[4];
  float diffuse[4];
  float emmisive[4];
  float shiny;
  
  // Ugly but works
  
  specular[0] = materials[materialId].sr;
  specular[1] = materials[materialId].sg;
  specular[2] = materials[materialId].sb;
  specular[3] = 1 - materials[materialId].transparency;
  
  glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, specular);
  
  ambient[0] = materials[materialId].ar;
  ambient[1] = materials[materialId].ag;
  ambient[2] = materials[materialId].ab;
  ambient[3] = 1 - materials[materialId].transparency;
  
  glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT, ambient);
  
  diffuse[0] = materials[materialId].dr;
  diffuse[1] = materials[materialId].dg;
  diffuse[2] = materials[materialId].db;
  diffuse[3] = 1 - materials[materialId].transparency;
  
  glMaterialfv(GL_FRONT_AND_BACK, GL_DIFFUSE, diffuse);
  
  emmisive[0] = materials[materialId].er;
  emmisive[1] = materials[materialId].eg;
  emmisive[2] = materials[materialId].eb;
  emmisive[3] = 1 - materials[materialId].transparency;
  
  glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, emmisive);
  
  glMaterialfv(GL_FRONT_AND_BACK, GL_SHININESS, &materials[materialId].shiny);
}

void drawModel()
{

    glBegin(GL_TRIANGLES);
  // Your code to draw the model here
    for (int i=0;i<faces.size();i++){
	setMaterial(faces[i].material);


	glNormal3f(normals[faces[i].normalIdxA].x, normals[faces[i].normalIdxA].y, normals[faces[i].normalIdxA].z);
        glVertex3f(verticies[faces[i].a].x,verticies[faces[i].a].y, verticies[faces[i].a].z);


	glNormal3f(normals[faces[i].normalIdxB].x, normals[faces[i].normalIdxB].y, normals[faces[i].normalIdxB].z);
        glVertex3f(verticies[faces[i].b].x,verticies[faces[i].b].y, verticies[faces[i].b].z);

    
	glNormal3f(normals[faces[i].normalIdxC].x, normals[faces[i].normalIdxC].y, normals[faces[i].normalIdxC].z);
        glVertex3f(verticies[faces[i].c].x,verticies[faces[i].c].y, verticies[faces[i].c].z);


    }
    glEnd();
}


void init(void)
{ // Called from main
  glEnable(GL_DEPTH_TEST);
  glEnable(GL_BLEND);
  glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
  glEnable(GL_LIGHTING);
  glEnable(GL_LIGHT0);
}


//double updateRate = 20;
int height = 100;
int width = 100;


bool xRotate=false,yRotate=false, zRotate=false;
float anglex=0,angley=0,anglez=0;

void timer(int)
{
  if (xRotate){
	anglex += 3.6;
  }

  if (yRotate){
	angley +=3.6;
  }

  if(zRotate){
	anglez +=3.6;
   }
  // Adjust rotation angles as needed here
  // Then tell glut to redisplay
  glutPostRedisplay();
  // And reset tht timer
  glutTimerFunc(1000.0 / updateRate, timer, 0);
}

void display(void)
{
  //glClearColor(0.0, 0.0, 0.0, 1.0); // black background
    glClearColor(1.0, 1.0, 1.0, 1.0);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();
    gluLookAt(0, 15.0, -25.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    // rotations and scaling here
    glScalef(1.2, 1.2, 1.2);
    glRotatef(anglex, 1,0.0,0.0);
    glRotatef(angley, 0, 1, 0.0);
    glRotatef(anglez, 0.0, 0.0, 1);
    // Draw th emodel
    drawModel();
    // Swap the double buffers
    glutSwapBuffers();
}

void reshape(int w, int h)
{
//    height = h;
 //   width = w;
    glViewport(0, 0, (GLsizei)w, (GLsizei)h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(60, (GLfloat)w / (GLfloat)h, 1.0, 100.0);
    glMatrixMode(GL_MODELVIEW);
}



void keyboard (unsigned char key, int x, int y) 
{
  // Keystroke processing here
   if (key == 'x'){
	xRotate = !xRotate;
   }
   if (key == 'y'){
	yRotate = !yRotate;
   }

   if (key == 'z'){
	zRotate = !zRotate;

   }
   if (key =='q'){
	exit(0);
   }

   
   
}


int main(int argc, char* argv[])
{
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA | GLUT_DEPTH);
    
	glutInitWindowSize(500, 500);
    glutInitWindowPosition(100, 100);
    glutCreateWindow("Jet Display");
    loadModel(); // Uncomment when the model reader is coded.

    loadMaterials();  // Uncomment when the materials reader is coded
    init();
    glutDisplayFunc(display);
    glutIdleFunc(display);
    glutKeyboardFunc (keyboard);
    glutReshapeFunc(reshape);
    // Compute the update rate here...
    glutTimerFunc(1000.0 / updateRate, timer, 0);
    glutMainLoop();
    return 0;
}

