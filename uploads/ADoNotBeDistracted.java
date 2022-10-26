import java.util.HashMap;
import java.util.HashSet;
import java.util.Scanner;

public class ADoNotBeDistracted {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt(), c=0;

        for (int j = 1; j <= t; j++) {
            int n = sc.nextInt();

            String s;
            s = sc.next();
            int a=0;

            HashSet<Character> h = new HashSet<>();

            for(int i=0; i<n; i++){
                if(!h.contains(s.charAt(i))){
                    h.add(s.charAt(i));
                }

                else{
                    System.out.println("NO");
                    a=1;
                    break;
                }

                while(i<n-1 && s.charAt(i)==s.charAt(i+1)){
                     i++;
                }
            }

            if(a==0) System.out.println("YES");

        }
    }
}
