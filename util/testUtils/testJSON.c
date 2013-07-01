#include <time.h>
#include <stdio.h>
#include <stdlib.h>
#include "../cJSON.h"

int main(int argc, char const *argv[])
{
  f = fopen("file.csv","w");
  int N = 100;
  int * a;
  int * t;
  a = malloc( N * sizeof(*a));
  t = malloc( N * sizeof(*t));
  srand(time(NULL));
  for(int i=0;i<N;i++){
    
    a[i] = rand();
    t[i] = i;
  }

  cJSON * root;
  char  * out;

  root=cJSON_CreateArray();
  root=cJSON_CreateObject();
  cJSON_AddItemToObject(root, "rand", cJSON_CreateIntArray(a,N));
  cJSON_AddItemToObject(root, "time", cJSON_CreateIntArray(t,N));
  out=cJSON_Print(root);  cJSON_Delete(root); printf("%s\n",out); free(out);
  return 0;
}